cd "$(dirname $0)"

mkdir express-backend/config

if [[ ! -e vue-frontend/.env ]] then
    touch vue-frontend/.env
    echo "VITE_API_BASE_URL=localhost:8091" > vue-frontend/.env
    "${EDITOR:-vi}" vue-frontend/.env
fi

echo "Now run ./express-backend/run.sh and ./vue-frontend/run.sh"