# tianqin

### 明天

打包的文件能不能打开用

怎么命名的

release Pre-release draft 差别 0.0.1,可以覆盖吗，怎么只留一个草稿，release在大版本更新的时候更新

draft 只有一个吗   

overwirte

怎么区分不同的 release

release / tag  msg 怎么设置

git tag -a v1.4 -m 'my version 1.4'

release 怎么读取到version 版本设置为 v{version}


### 开发流程
yanqiong/tianqin/bugfix_xxx develop

git pull shinny master

git push yanqiong master

git checkout -b bugfix_xxx(from master)

git push yanqiong bugfix_xxx

pull request (yanqiong/tinaqin/bugfix_xxx => shinnytech/tianqin/master)  // build draft
 
yangyang review & merged => CI build // build release

merged 的时候填信息  根据填写的信息区分 draft 和 release
还是根据不同分分支区分 draft 和 release







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

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# tianqin
