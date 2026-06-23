cmake_minimum_required(VERSION 3.20)

project(Black_Lounge
        VERSION 1.0.0.0
        DESCRIPTION "Guitar amplifier inspired by the Black Lougne studios"
)

singularity_create_plugin(
    ${PROJECT_NAME}
    FORMATS APP VST3
    PLUGIN_CLASS BlackLounge
    PLUGIN_CLASS_HEADER "BlackLounge.h"
    RESOURCES
        resources/background.png
        resources/mb-forever-raw.regular.ttf
    DATA_RESOURCES
        "../nam/jcm900 peter reamp.nam"
        "../nam/GP-OD 808  25Drive 06Tone 10Lvl.nam"
        data/800_4x_2_02_MIX_RAW_V2.wav
)

target_link_libraries(
    ${PROJECT_NAME}
    PUBLIC
    Amp
)