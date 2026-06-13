cmake_minimum_required(VERSION 3.20)

project(Black_Lounge
        VERSION 1.0.0.0
        DESCRIPTION "Guitar amplifier inspired by the Black Lougne studios"
)

singularity_create_plugin(
    ${PROJECT_NAME}
    UI
        main.js
    FORMATS APP VST3
    PLUGIN_CLASS BlackLounge
    PLUGIN_CLASS_HEADER "BlackLounge.h"
    RESOURCES background.png
    DATA_RESOURCES
        abyss.nam
        800_4x_2_02_MIX_RAW_V2.wav
)

target_link_libraries(
    ${PROJECT_NAME}
    PUBLIC
    Amp
    IR
)

