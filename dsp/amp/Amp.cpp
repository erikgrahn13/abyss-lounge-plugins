#include "Amp.h"
#include <iostream>

Amp::Amp(const unsigned char *ampData, const int ampDataSize) : mAmpData(ampData), mAmpDataSize(ampDataSize)
{

    std::string json_str(reinterpret_cast<const char *>(mAmpData), static_cast<size_t>(mAmpDataSize));

    auto j = nlohmann::json::parse(json_str);
    nam::verify_config_version(j["version"]);

    auto architecture = j["architecture"];
    nlohmann::json config = j["config"];

    std::vector<float> weights;
    if (j.find("weights") != j.end())
    {
        auto weight_list = j["weights"];
        for (auto it = weight_list.begin(); it != weight_list.end(); ++it)
            weights.push_back(*it);
    }
    else
        throw std::runtime_error("Corrupted model file is missing weights.");

    nam::dspData returnedConfig;
    // Assign values to returnedConfig
    returnedConfig.version = j["version"];
    returnedConfig.architecture = j["architecture"];
    returnedConfig.config = j["config"];
    returnedConfig.metadata = j["metadata"];
    returnedConfig.weights = weights;
    if (j.find("sample_rate") != j.end())
        returnedConfig.expected_sample_rate = j["sample_rate"];
    else
    {
        returnedConfig.expected_sample_rate = -1.0;
    }

    /*Copy to a new dsp_config object for get_dsp below,
    since not sure if params actually get modified as being non-const references on some
    model constructors inside get_dsp(dsp_config& conf).
    We need to return unmodified version of dsp_config via returnedConfig.*/
    nam::dspData conf = returnedConfig;

    mNamModel = get_dsp(conf);

    if (!mNamModel)
    {
        std::cout << "Nam FAILED!!!" << std::endl;
        exit(0);
    }
}

Amp::~Amp()
{
}

void Amp::prepare()
{
}

template<typename SampleType>
void Amp::process(const SampleType* input, SampleType* output, int numSamples)
{
    if (!mNamModel) return;

    if constexpr (std::is_same_v<SampleType, NAM_SAMPLE>)
    {
        // same underlying sample type: forward directly (drop const if needed)
        mNamModel->process(const_cast<NAM_SAMPLE*>(reinterpret_cast<const NAM_SAMPLE*>(input)),
                           reinterpret_cast<NAM_SAMPLE*>(output),
                           numSamples);
    }
    else
    {
        // convert to NAM_SAMPLE, process, convert back
        std::vector<NAM_SAMPLE> in(numSamples), out(numSamples);
        for (int i = 0; i < numSamples; ++i) in[i] = static_cast<NAM_SAMPLE>(input[i]);
        mNamModel->process(in.data(), out.data(), numSamples);
        for (int i = 0; i < numSamples; ++i) output[i] = static_cast<SampleType>(out[i]);
    }
}

// Explicit instantiations so linker finds symbols:
template void Amp::process<float>(const float* input, float* output, int numSamples);
template void Amp::process<double>(const double* input, double* output, int numSamples);
