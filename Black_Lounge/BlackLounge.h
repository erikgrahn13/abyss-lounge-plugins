#pragma once

#include "../SingularityPlugin.h"
#include "Amp.h"
#include "generated_data_resources.h"

class BlackLounge {
public:
    static constexpr bool isInstrument = false;
    static constexpr bool isResizable = false;

    static auto getParameters()
    {
        return std::to_array<Parameter>({
            { .id = 13, .name = "Volume", .type = ParamType::Float, .minValue = 0.0, .maxValue = 1.0, .defaultValue = 0.5 }
        });
    }

    void prepare(double sampleRate, int maxBlockSize) {
        blackLoungeAmp_ = std::make_unique<Amp>(singularity_data::jcm900_peter_reamp_nam.data, singularity_data::jcm900_peter_reamp_nam.size,
                                                singularity_data::_800_4x_2_02_MIX_RAW_V2_wav.data, singularity_data::_800_4x_2_02_MIX_RAW_V2_wav.size);
        blackLoungeOverDrive_ = std::make_unique<Amp>(singularity_data::GP_OD_808__25Drive_06Tone_10Lvl_nam.data, singularity_data::GP_OD_808__25Drive_06Tone_10Lvl_nam.size);
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
            blackLoungeOverDrive_->process(inputs[0], outputs[0], numSamples);
            blackLoungeAmp_->process(outputs[0], outputs[0], numSamples);
#endif      
        }
    }

    private:
    std::unique_ptr<Amp> blackLoungeAmp_;
    std::unique_ptr<Amp> blackLoungeOverDrive_;
};

static_assert(SingularityPlugin<BlackLounge>);
