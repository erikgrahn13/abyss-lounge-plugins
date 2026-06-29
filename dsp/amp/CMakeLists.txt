cmake_minimum_required(VERSION 3.19)

add_library(Amp STATIC
    Amp.cpp
    Amp.h
    ${nam_SOURCE_DIR}/NAM/get_dsp.cpp
    ${nam_SOURCE_DIR}/NAM/dsp.cpp
    ${nam_SOURCE_DIR}/NAM/lstm.cpp
    ${nam_SOURCE_DIR}/NAM/convnet.cpp
    ${nam_SOURCE_DIR}/NAM/conv1d.cpp
    ${nam_SOURCE_DIR}/NAM/util.cpp
    ${nam_SOURCE_DIR}/NAM/activations.cpp
    ${nam_SOURCE_DIR}/NAM/ring_buffer.cpp
    ${nam_SOURCE_DIR}/NAM/container.cpp
    ${nam_SOURCE_DIR}/NAM/wavenet/model.cpp
    ${nam_SOURCE_DIR}/NAM/wavenet/a2_fast.cpp
    ${nam_SOURCE_DIR}/NAM/wavenet/slimmable.cpp
)

target_link_libraries(Amp PUBLIC
    IR
)

target_compile_definitions(Amp PUBLIC NAM_SAMPLE_FLOAT)

if(NOT MSVC)
    target_compile_options(Amp PRIVATE -fPIC)
endif()

# Any target that links Amp must include all its TUs so static initializers
# that register NAM architecture parsers (e.g. SlimmableContainer) run.
if(APPLE)
    target_link_options(Amp INTERFACE
        -Wl,-force_load,$<TARGET_LINKER_FILE:Amp>
    )
elseif(MSVC)
    target_link_options(Amp INTERFACE
        /WHOLEARCHIVE:$<TARGET_LINKER_FILE:Amp>
    )
else()
    target_link_options(Amp INTERFACE
        -Wl,--whole-archive
        $<TARGET_LINKER_FILE:Amp>
        -Wl,--no-whole-archive
    )
endif()

target_include_directories(Amp PUBLIC
    ${CMAKE_CURRENT_LIST_DIR}
    ${nam_SOURCE_DIR}
    ${eigen_SOURCE_DIR}
    ${nlohmann-json_SOURCE_DIR}
)
