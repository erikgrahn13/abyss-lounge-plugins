add_library(IR STATIC
    ir.cpp
    ir.h
)

target_compile_options(IR PRIVATE -fPIC)

target_include_directories(IR PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# target_link_libraries(main PUBLIC IR)