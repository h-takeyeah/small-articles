@echo off
rem Windows batch file
pushd "path\to\directory"

for %%i in (%cd%*.mp3) do (
  ffplay -autoexit -nodisp -i %%i
)
pause nul
