const { exec } = require('child_process'),
      NwBuilder = require('nw-builder'),
      path = './src/temp'


exec(`mkdir ${path}`)
exec(`cp -rf ./src/build ${path}`)
exec(`cp ./src/package.json ${path}`)
const nw = new NwBuilder({
    files: `${path}/**`,
    platforms: ['osx64', 'win32', 'win64', 'linux32', 'linux64'],
    flavor: 'normal'
})


nw.on('log',  console.log)
nw.build().then(function () {
   console.log('all done!')
   exec(`rm -rf ${path}`)
}).catch(function (error) {
    console.error(error)
})
