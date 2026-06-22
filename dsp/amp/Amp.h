#pragma once

#include "NAM/dsp.h"
#include "ir.h"
#include <deque>
#include <string>

class Amp
{

  public:
    explicit Amp(const unsigned char *ampData, const int ampDataSize);
    Amp(const unsigned char *ampData, const int ampDataSize, const uint8_t* irData, int irSize);
    Amp(const unsigned char *ampData, const int ampDataSize, const std::string& irFilename);
    Amp() = delete;
    ~Amp();

    void prepare();
    void resetAndPrewarm(double sampleRate, int maxBlockSize);

    template<typename SampleType>
    void process(const SampleType* input, SampleType* output, int numSamples);

  private:
    void initNam();

    const unsigned char *mAmpData;
    const int mAmpDataSize;
    std::unique_ptr<nam::DSP> mNamModel;
    std::unique_ptr<IR> ir_;
};