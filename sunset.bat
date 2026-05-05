@echo off

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python n'est pas installé !
    echo Télécharge-le ici : https://www.python.org/downloads/
    pause
    exit
)
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installation de Flask pour l'initialisation de Sunset...
    pip install flask
     if %errorlevel% neq 0 (
        echo Erreur : Flask n'a pas pu être installé !
        pause
        exit
    )
)
echo Lancement de Sunset...
start http://localhost:5000
python app.py

