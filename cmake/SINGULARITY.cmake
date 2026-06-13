FetchContent_Declare(
    singularity
    GIT_REPOSITORY https://github.com/erikgrahn13/singularity.git
    GIT_TAG main
    GIT_SHALLOW TRUE
)

FetchContent_MakeAvailable(singularity)