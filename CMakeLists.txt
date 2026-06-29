cmake_minimum_required(VERSION 3.20)

project(Abyss-Lounge)

enable_testing()

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/cmake")
include(FetchContent)

include(SINGULARITY)
include(NAM)
include(Pluginval)

add_subdirectory(dsp)
add_subdirectory(Black_Lounge)
