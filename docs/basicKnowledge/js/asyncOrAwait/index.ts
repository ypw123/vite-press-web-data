function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  console.log(num1)
  const num2 = yield fn(num1)
  console.log(num2)
  const num3 = yield fn(num2)
  console.log(num3)
  const num4 = yield fn(num3)
  console.log(num4)

  return num4
}

function generatorToAsync(generator){
   return function(){
    const  gen = generator.apply(this, arguments)
    return  new Promise((reslove,reject)=>{
       const go = (val= null)=>{
         let  g 
         try{
          g = gen.next(val)
         }catch(e){
            reject(e)
         }
         if(g.done){
          return  reslove(g.value)
        }
        return  Promise.resolve(g.value).then(val=> go(val),err => go(err))
       }
       go()
    })

   }

}

const asyncFn = generatorToAsync(gen)
asyncFn().then((res:any)=>{
  console.log(res)
})

