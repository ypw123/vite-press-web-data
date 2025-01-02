const  PENDING = 'PENDING'
const  FULFILLED= 'FULFILLED'
const  REJECTED = 'REJECTED'

class myPromise{
    status: string
    value:any
    reason:any
    onFulfilledCallbacks:any
    onRejectedCallbacks:any
    constructor(executor){
        this.status = PENDING
        this.value =undefined
        this.reason = undefined
        this.onFulfilledCallbacks =[]
        this.onRejectedCallbacks =[]
        const resolve = (value:any)=>{
            if(this.status === PENDING){
                this.status = FULFILLED
                this.value = value
                this.onFulfilledCallbacks.forEach((cb:any)=> cb(this.value))
            }
        }
        const reject = (value:any)=>{
            if(this.status === PENDING){
                this.status = REJECTED
                this.reason = value
                this.onRejectedCallbacks.forEach((cb:any)=> cb( this.reason))
            }
        }
        try{
          executor(resolve,reject)
        }catch(e){
          reject(e)
        }
    
    }
    then(onFulfilled,onRejected){
        onFulfilled = typeof onFulfilled  ===  "function"?onFulfilled:(v:any)=>v
        onRejected=  typeof onRejected  ===  "function"?onRejected:(v:any)=>{
            throw (v)
        };

        const promise2 = new myPromise((resolve,reject)=>{
           if(this.status === FULFILLED){
            queueMicrotask(() => {
                try{
                    const x =  onFulfilled(this.value)
                    if(x === promise2){
                        return  reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
                    }
                    if(x instanceof myPromise) {
                        x.then(resolve, reject)
                      } else{
                        resolve(x)
                      }
                }catch(e){
                    reject(e)
                }
            })
           }
           if(this.status === REJECTED){
            try{
                const x = onRejected(this.reason)
                resolve(x)
            }catch(e){
                reject(e)
            }
          }
          if(this.status === PENDING){
            this.onFulfilledCallbacks.push(()=>{
                try{
                    const x =  onFulfilled(this.value)
                    resolve(x)
                }catch(e){
                    reject(e)
                }
            })
            this.onRejectedCallbacks.push(()=>{
                try{
                    const x = onRejected(this.reason)
                    resolve(x)
                }catch(e){
                   reject(e)
                }
            })
        }
        })

      return promise2
    }
    static resolve(parameter){
        if (parameter instanceof myPromise) {
            return parameter;
        }
        return new myPromise( resolve=>{
            resolve(parameter)
        })
    }
    static reject(reason){
         return new myPromise((resolve,reject)=>{
            reject(reason)
         })
    }
}



Promise.resolve().then(() => {
    console.log(0);
    return Promise.resolve(4);
  }).then((res) => {
    console.log(res)
  })
  
  Promise.resolve().then(() => {
    console.log(1);
  }).then(() => {
    console.log(2);
  }).then(() => {
    console.log(3);
  }).then(() => {
    console.log(5);
  }).then(() =>{
    console.log(6);
  })

