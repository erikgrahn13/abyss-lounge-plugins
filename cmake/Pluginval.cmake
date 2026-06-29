function(enable_plugin_testing target)
    get_target_property(vst3_bundle_path ${target}_VST3 SMTG_PLUGIN_PACKAGE_PATH)
    if(UNIX AND NOT APPLE)
        # Linux CI runners are headless — wrap with xvfb-run to provide a virtual display.
        find_program(XVFB_RUN xvfb-run)
        set(_runner ${XVFB_RUN} -a)
    endif()
    add_test(NAME ${target}_VST3_TEST
        COMMAND ${_runner}
            ${pluginval_SOURCE_DIR}/${PLUGINVAL_BINARY_PATH}
            --strictness-level 10
            --validate-in-process "${vst3_bundle_path}")
endfunction()

if(WIN32)
    set(PLUGINVAL_URL "https://github.com/Tracktion/pluginval/releases/latest/download/pluginval_Windows.zip")
    set(PLUGINVAL_BINARY_PATH "pluginval.exe")
elseif(APPLE)
    set(PLUGINVAL_URL "https://github.com/Tracktion/pluginval/releases/latest/download/pluginval_macOS.zip")
    set(PLUGINVAL_BINARY_PATH "Contents/MacOS/pluginval")
elseif(UNIX)
    set(PLUGINVAL_URL "https://github.com/Tracktion/pluginval/releases/latest/download/pluginval_Linux.zip")
    set(PLUGINVAL_BINARY_PATH "pluginval")
endif()

FetchContent_Declare(
    pluginval
    URL ${PLUGINVAL_URL}
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)
FetchContent_MakeAvailable(pluginval)