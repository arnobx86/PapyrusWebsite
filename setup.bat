@echo off
cmd /c "npx -y create-next-app@latest papyrus-website --typescript --tailwind --eslint --app --src-dir --import-alias \"@/*\" --use-npm --no-git --yes"
if exist papyrus-website (
    xcopy /e /i /y papyrus-website\* .
    rd /s /q papyrus-website
    del package.json
    ren papyrus-website\package.json package.json
    echo Setup Complete
) else (
    echo Setup Failed
)
