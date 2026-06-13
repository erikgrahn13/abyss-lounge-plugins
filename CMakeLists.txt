cmake_minimum_required(VERSION 3.20)

project(Abyss-Lounge)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/cmake")
include(FetchContent)

include(SINGULARITY)
include(NAM)

add_subdirectory(dsp)
add_subdirectory(Black_Lounge)
