git add .
if [ -z "$1" ]; then
    read -p "Enter commit message: " message
    git commit -m "$message"
else
    git commit -m "$1"
fi
git push
clear
