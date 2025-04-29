#usar una imagen base de node.js 22
FROM node:22-alpine
#establecer el directorio de trabajo
WORKDIR /meetEase-frontend
#copiar el package.json y el package-lock.json al contenedor
COPY package*.json ./

#instalar las dependencias
RUN npm install
#copiar el resto de los archivos al contenedor
COPY . .
#exponer el puerto 5173
EXPOSE 5173
#comando para iniciar la aplicacion
CMD ["npm", "run", "dev"]
#docker build -t meetaase:1.0 .