find_package(Git)

add_custom_target(version
  ${CMAKE_COMMAND} -D SRC=${CMAKE_CURRENT_SOURCE_DIR}/version.h.in
                   -D DST=${CMAKE_CURRENT_SOURCE_DIR}/version.h
                   -D GIT_EXECUTABLE=${GIT_EXECUTABLE}
                   -P ${CMAKE_CURRENT_SOURCE_DIR}/GenerateVersionHeader.cmake
  )
add_dependencies(vocascan-server version)

target_include_directories(vocascan-server PRIVATE .)
target_sources(vocascan-server 
PRIVATE 
    version.h
)