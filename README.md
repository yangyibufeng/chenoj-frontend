# chenoj-frontend

## 快速根据后端接口生成代码
```shell
openapi --input http://地址:端口号/api/v2/api-docs --output ./generated --client axios
```
## 通过Prettier格式化生成的ts代码文件
```shell
npx prettier --write "项目地址\generated\**\*.ts"
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
