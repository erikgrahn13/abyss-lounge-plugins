FetchContent_Declare(
    nam
    URL https://github.com/sdatkinson/NeuralAmpModelerCore/archive/refs/tags/v0.5.3.zip
    SOURCE_SUBDIR IGNORE
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE
    EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(nam)

# eigen and nlohmann-json are dependencies that nam requires under the hood
FetchContent_Declare(
    eigen
    URL https://gitlab.com/libeigen/eigen/-/archive/87300c93cae6a8afd9a4f8aa8d9d5c5324cf02e1/eigen-87300c93cae6a8afd9a4f8aa8d9d5c5324cf02e1.zip
    SOURCE_SUBDIR IGNORE
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE
    EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(eigen)

FetchContent_Declare(
    nlohmann-json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.hpp
    SOURCE_SUBDIR IGNORE
    DOWNLOAD_NO_EXTRACT TRUE
    EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(nlohmann-json)
