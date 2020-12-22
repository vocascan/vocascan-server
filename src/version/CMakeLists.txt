configure_file(version.h.in ${CMAKE_CURRENT_SOURCE_DIR}/version.h @ONLY)

target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    version.h
)