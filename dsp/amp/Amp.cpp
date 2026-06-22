#include "Amp.h"
#include "NAM/get_dsp.h"
#include <iostream>

Amp::Amp(const unsigned char *ampData, const int ampDataSize) : mAmpData(ampData), mAmpDataSize(ampDataSize)
{
    initNam();
}

Amp::Amp(const unsigned char *ampData, const int ampDataSize, const uint8_t* irData, int irSize) : mAmpData(ampData), mAmpDataSize(ampDataSize)
{
    initNam();
    ir_ = std::make_unique<IR>(irData, irSize);
}

Amp::Amp(const unsigned char *ampData, const int ampDataSize, const std::string& irFilename) : mAmpData(ampData), mAmpDataSize(ampDataSize)
{
    initNam();
    ir_ = std::make_unique<IR>(irFilename);
}

void Amp::initNam()
{
    std::string json_str(reinterpret_cast<const char *>(mAmpData), static_cast<size_t>(mAmpDataSize));
    auto j = nlohmann::json::parse(json_str);
    nam::verify_config_version(j["version"]);
    mNamModel = nam::get_dsp(j);
    if (!mNamModel)
        throw std::runtime_error("NAM get_dsp returned null");
}

Amp::~Amp()
{
}

void Amp::prepare()
{
}

void Amp::resetAndPrewarm(double sampleRate, int maxBlockSize)
{
    if (mNamModel)
        mNamModel->ResetAndPrewarm(sampleRate, maxBlockSize);
}

template<typename SampleType>
void Amp::process(const SampleType* input, SampleType* output, int numSamples)
{
    if (!mNamModel) return;

    if constexpr (std::is_same_v<SampleType, NAM_SAMPLE>)
    {
        // same underlying sample type: forward directly (drop const if needed)
        NAM_SAMPLE* inputPtr = const_cast<NAM_SAMPLE*>(reinterpret_cast<const NAM_SAMPLE*>(input));
        NAM_SAMPLE* outputPtr = reinterpret_cast<NAM_SAMPLE*>(output);
        mNamModel->process(&inputPtr, &outputPtr, numSamples);

        if (ir_)
            ir_->process(output, output, numSamples);

        for (int i = 0; i < numSamples; ++i)
            output[i] *= 0.1f;
    }
    else
    {
        // convert to NAM_SAMPLE, process, convert back
        std::vector<NAM_SAMPLE> in(numSamples), out(numSamples);
        for (int i = 0; i < numSamples; ++i) in[i] = static_cast<NAM_SAMPLE>(input[i]);
        NAM_SAMPLE* inPtr = in.data();
        NAM_SAMPLE* outPtr = out.data();
        mNamModel->process(&inPtr, &outPtr, numSamples);
        for (int i = 0; i < numSamples; ++i) output[i] = static_cast<SampleType>(out[i]);
    }
}

// Explicit instantiations so linker finds symbols:
template void Amp::process<float>(const float* input, float* output, int numSamples);
template void Amp::process<double>(const double* input, double* output, int numSamples);
