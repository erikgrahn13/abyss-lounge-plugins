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

    IR(const uint8_t* data, int size)
    {
        parseWav(data, static_cast<std::size_t>(size));
        initHistory();
    }

    IR(const std::string& filename)
    {
        std::ifstream wavFile(filename, std::ios::binary);
        if (!wavFile.is_open())
            throw std::runtime_error("Failed to open WAV file: " + filename);

        wavFile.seekg(0, std::ios::end);
        std::size_t fileSize = wavFile.tellg();
        wavFile.seekg(0, std::ios::beg);

        std::vector<uint8_t> fileData(fileSize);
        wavFile.read(reinterpret_cast<char*>(fileData.data()), fileSize);
        wavFile.close();

        parseWav(fileData.data(), fileSize);
        initHistory();
    }

private:
    void parseWav(const uint8_t* data, std::size_t size)
    {
        if (size < 12)
            throw std::runtime_error("WAV data too small");

        std::size_t pos = 12; // skip RIFF header

        // Find fmt chunk
        std::uint32_t fmtChunkSize = 0;
        while (pos + 8 <= size)
        {
            std::string_view id(reinterpret_cast<const char*>(data + pos), 4);
            std::uint32_t chunkSize;
            std::memcpy(&chunkSize, data + pos + 4, sizeof(chunkSize));
            pos += 8;

            if (id == "fmt ")
            {
                fmtChunkSize = chunkSize;
                break;
            }

            pos += chunkSize;
        }

        if (fmtChunkSize == 0 || pos + fmtChunkSize > size)
            throw std::runtime_error("fmt chunk not found or truncated");

        std::memcpy(&fmt_, data + pos, sizeof(FmtChunk));
        pos += fmtChunkSize;

        if (fmt_.wFormatTag != 1 || fmt_.wBitsPerSample != 24)
            throw std::runtime_error("Only 24-bit PCM WAV files are supported");

        if (fmt_.nChannels != 1)
            throw std::runtime_error("Only IR with 1 channel supported");

        // Find data chunk
        std::uint32_t dataChunkSize = 0;
        while (pos + 8 <= size)
        {
            std::string_view id(reinterpret_cast<const char*>(data + pos), 4);
            std::uint32_t chunkSize;
            std::memcpy(&chunkSize, data + pos + 4, sizeof(chunkSize));
            pos += 8;

            if (id == "data")
            {
                dataChunkSize = chunkSize;
                break;
            }

            pos += chunkSize;
        }

        if (dataChunkSize == 0 || pos + dataChunkSize > size)
            throw std::runtime_error("data chunk not found or truncated");

        const uint8_t* sampleData = data + pos;
        const std::size_t numSamples = dataChunkSize / fmt_.nBlockAlign;

        coefficients_.resize(numSamples);

        for (std::size_t i = 0; i < numSamples; ++i)
        {
            const std::size_t offset = i * fmt_.nBlockAlign;

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

    void initHistory()
    {
        std::size_t histSize = 1;
        while (histSize < coefficients_.size())
            histSize <<= 1;
        history_.resize(histSize, 0.0f);
        historyMask_ = histSize - 1;
    }

public:

    template<typename SampleType>
    void process(const SampleType* input, SampleType* output, int numSamples)
    {
        for (int n = 0; n < numSamples; ++n)
        {
            // Write the new input sample into the circular buffer
            history_[writePos_ & historyMask_] = static_cast<float>(input[n]);

            // Convolve: sum over all IR coefficients
            float sum = 0.0f;
            for (std::size_t k = 0; k < coefficients_.size(); ++k)
                sum += history_[(writePos_ - k) & historyMask_] * coefficients_[k];

            output[n] = static_cast<SampleType>(sum);
            ++writePos_;
        }
    }

    private:
    FmtChunk fmt_{};
    std::vector<float> coefficients_;
    std::vector<float> history_;
    std::size_t historyMask_ = 0;
    std::size_t writePos_ = 0;
};

