#pragma once

#include "../SingularityPlugin.h"
#include "Amp.h"
#include "embedded/Black_Lounge_generated.h"

class BlackLounge {
public:
    static constexpr bool isInstrument = false;

    static auto getParameters()
    {
        return std::to_array<Parameter>({
            { .id = 13, .name = "Volume", .type = ParamType::Float, .minValue = 0.0, .maxValue = 1.0, .defaultValue = 0.5 }
        });
    }

    void prepare(double sampleRate, int maxBlockSize) {
        blackLoungeAmp_ = std::make_unique<Amp>(singularity::generated::abyss_nam.data, singularity::generated::abyss_nam.size);
    }

    template<typename SampleType>
    void process(std::span<const SampleType* const> inputs,
                 std::span<SampleType* const> outputs,
                 int numSamples,
                 ParamList params)
    {
        if (blackLoungeAmp_)
        {
#if defined NDEBUG
            blackLoungeAmp_->process(inputs[0], outputs[0], numSamples);
#endif
        }
    }

    private:
    std::unique_ptr<Amp> blackLoungeAmp_;
};

static_assert(SingularityPlugin<BlackLounge>);
