#pragma once

#include <cstring>
#include <fstream>
#include <iostream>
#include <array>
#include <cstdint>
#include <vector>
#include <stdexcept>

class IR {
    public:

    struct FmtChunk
    {
        std::uint16_t wFormatTag;
        std::uint16_t nChannels;
        std::uint32_t nSamplesPerSec;
        std::uint32_t nAvgBytesPerSec;
        std::uint16_t nBlockAlign;
        std::uint16_t wBitsPerSample;
    };

    IR(){
        std::string filename = "/home/erik/Development/abyss-lounge-plugins/Black_Lounge/800_4x_2_02_MIX_RAW_V2.wav";

        std::ifstream wavFile(filename, std::ios::binary);
        if(wavFile.is_open())
        {
            std::cout << "File Opened successfully" << std::endl;
            std::array<char, 12> riffHeader{};
            wavFile.read(riffHeader.data(), riffHeader.size());

            std::array<char, 8> chunkHeader{};
            uint32_t fmtChunkSize{0};

            while (wavFile.read(chunkHeader.data(), chunkHeader.size()))
            {
                std::string_view id(chunkHeader.data(), 4);

                std::uint32_t size;
                std::memcpy(&size, chunkHeader.data() + 4, sizeof(size));

                if (id == "fmt ")
                {
                    fmtChunkSize = size;
                    break;
                }

                wavFile.seekg(size, std::ios::cur);
            }

            std::vector<char> fmtData(fmtChunkSize);
            wavFile.read(fmtData.data(), fmtData.size());

            std::memcpy(&fmt_, fmtData.data(), sizeof(FmtChunk));

            if (fmt_.wFormatTag != 1 || fmt_.wBitsPerSample != 24)
            {
                throw std::runtime_error("Only 24-bit PCM WAV files are supported");
            }

            if(fmt_.nChannels != 1)
            {
                throw::std::runtime_error("Only IR with 1 channel supported");
            }


            std::uint32_t dataChunkSize = 0;
            while (wavFile.read(chunkHeader.data(), chunkHeader.size()))
            {
                std::string_view id(chunkHeader.data(), 4);

                std::uint32_t size{};
                std::memcpy(&size,
                            chunkHeader.data() + 4,
                            sizeof(size));

                if (id == "data")
                {
                    dataChunkSize = size;
                    break;
                }

                wavFile.seekg(size, std::ios::cur);
            }

            std::vector<char> sampleData(dataChunkSize);
            sampleData.resize(dataChunkSize);
            wavFile.read(sampleData.data(), sampleData.size());

            const std::size_t bytesPerSample = fmt_.wBitsPerSample / 8;


            const std::size_t numSamples = dataChunkSize / fmt_.nBlockAlign;

            coefficients_.resize(numSamples);

            for (std::size_t i = 0; i < numSamples; ++i)
            {
                const std::size_t offset = i * fmt_.nBlockAlign;

                if (fmt_.wFormatTag == 1 && fmt_.wBitsPerSample == 24)
                {
                    std::int32_t sample =
                        (static_cast<std::uint8_t>(sampleData[offset + 0]) << 0)  |
                        (static_cast<std::uint8_t>(sampleData[offset + 1]) << 8)  |
                        (static_cast<std::uint8_t>(sampleData[offset + 2]) << 16);

                    // sign extend 24-bit to 32-bit
                    if (sample & 0x00800000)
                        sample |= 0xFF000000;

                    coefficients_[i] = static_cast<float>(sample) / static_cast<float>(1 << 23);
                }
            }
        }
        else
        {
            std::cout << "Failed to open the wavfile" << std::endl;
        }

        wavFile.close();
        std::cout << "Wavefile closed" << std::endl;
    }

    ~IR()
    {
    }

    template<typename SampleType>
    void process(const SampleType* input, SampleType* output, int numSamples)
    {
        for (int n = 0; n < numSamples; ++n)
        {
            output[n] = 0;

            for (int k = 0; k < coefficients_.size(); ++k)
            {
                const int inputIndex = n - static_cast<int>(k);

                if (inputIndex >= 0)
                    output[n] += input[inputIndex] * coefficients_[k];
            }
        }
    }

    private:
    FmtChunk fmt_{};
    std::vector<float> coefficients_;
};

