cd "$(dirname $0)"

mkdir express-backend/config

cd vue-frontend
npm install

cd ../express-backend
npm install

cd ..

if [[ ! -e vue-frontend/.env ]] then
    touch vue-frontend/.env
    echo "VITE_API_BASE_URL=http://localhost:8091" > vue-frontend/.env
fi

"${EDITOR:-vi}" vue-frontend/.env