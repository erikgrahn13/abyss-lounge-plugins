#pragma once

#include "NAM/dsp.h"
#include <deque>

class Amp
{

  public:
    explicit Amp(const unsigned char *ampData, const int ampDataSize);
    Amp() = delete;
    ~Amp();

    void prepare();

    template<typename SampleType>
    void process(const SampleType* input, SampleType* output, int numSamples);

  private:
    const unsigned char *mAmpData;
    const int mAmpDataSize;
    std::unique_ptr<nam::DSP> mNamModel;
};