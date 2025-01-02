

const numArr = [ 1, 2, 3, 4]
// console.log(numArr.hasOwnProperty(4))

Array.prototype.myReduce = function(fn,initialValue){
   let  pre ,index
   let arr = [...this]
  if(initialValue === undefined){
    for(let i = 0; i<arr.length;i++){
        if(!arr.hasOwnProperty(i)) continue
        pre = arr[i]
        index = i + 1
        break
    }
  }else{
    pre = initialValue
    index = 0
  }
 
  for(let i = index; i<arr.length;i++){
    if(!arr.hasOwnProperty(i)) continue
    pre = fn.call(null,pre,arr[i],i,this)
}
 return pre
}


const  compose = function(list:any){
  const init = list.shift()
   return  function(...arg){
    return list.reduce((pre,cur)=>{
      return pre.then(res=>{
        return cur.call(null,res)
      })
    },
    Promise.resolve(init.apply(null,arg))
   )
   }
}


const sync = (data:any)=>{
    return data+1
}

const sync1 = (data:any)=>{
    return data+1
}

const sync2 = (data:any)=>{
    return data+2
}

const syncFn = compose([sync,sync1,sync2])
// syncFn(2).then((res=>{
//     console.log(res)
// }))


//数组扁平化
const arr1 = [1, 2, 3, [4, [5, [6]]]]

const myFlat = function(arr, deep = 1){
    if(deep == 0) return arr
    return arr.reduce((pre,cur)=>{
        if(Array.isArray(cur)){
            return [...pre ,...myFlat(cur,deep -1)]
        }else{
            return [...pre,cur]
        }
    },[])
}
// console.log(myFlat(arr1,3))

//手写map

const mapArr = [1,2,3,4,5]

Array.prototype.selfMap = function (fn,thisArr = window) {
  const  arr = this
  const newArr = new Array(arr.length)
  if( typeof fn  !== 'function' ){
     throw new TypeError(fn + 'is not a function')  
  }
  for(let i=0 ;i<arr.length;i++){
       if(i in arr){
        newArr[i] = fn.call(thisArr,arr[i],i,arr)
       }
  }
  return newArr
}
// const mapArr2 = mapArr.selfMap(111)
// console.log(mapArr2)


//手写 some

Array.prototype.mySome =function (fn:any){
  const arr = this
  let result = false
  if( typeof fn  !== 'function' ){
    throw new TypeError(fn + 'is not a function')  
 }
 for(let i=0 ;i<arr.length;i++){
     if(fn(arr[i])){
      result = true
     }
 }
 return  result
}


//模板字符串

let name1 = "小明";
let age = 20;
let str1 = "我叫${name1},我的年龄 ${ age}";
function tempalteStr(str) {
  return str.replace(/\$\{(.*?)\}/g, function(str, k) {
    return eval(k);
  });
}
// console.log(tempalteStr(str1)); // 我叫小明,我的年龄20


//防抖节流

function debounce(fn, time, flag) {
  let timer;
  return function(...args) {
    // 在time时间段内重复执行，会清空之前的定时器，然后重新计时
    timer && clearTimeout(timer);
    if (flag && !timer) {
      // flag为true 第一次默认执行
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function fn(a) {
  console.log("执行:", a);
}

let debounceFn = debounce(fn, 3000, true);
// debounceFn(1)
// debounceFn(2)
// debounceFn(3)
/*
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function throttle(fn, time, flag) {
  let timer;
  return function(...args) {
    // flag控制第一次是否立即执行
    if (flag) {
      fn.apply(this, args);
      // 第一次执行完后，flag变为false；否则以后每次都会执行
      flag = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        clearTimeout(timer);
        // 每次执行完重置timer
        timer = null;
      }, time);
    }
  };
}

// 测试
function fn1(a:any) {
  console.log("fn:"+ a);
}
let throttleFn = throttle(fn1, 3000, true);
// setInterval(throttleFn, 500);
// throttleFn(2)
// throttleFn(3)
// throttleFn()
// throttleFn()
// 测试结果，一开始就打印"fn", 以后每隔3s打印一次"fn"


const actions = ()=>{
  const functionA = ()=>{/*do sth*/}
  const functionB = ()=>{/*do sth*/}
  return new Map([
    [/^guest_[1-4]$/,functionA],
    [/^guest_5$/,functionB],
  ])
}

const onButtonClick = (identity,status)=>{
  // console.log(actions())
  let action = [...actions()].filter(([key,value])=>(key.test(`${identity}_${status}`)))
  action.forEach(([key,value])=>value.call(this))
}
// onButtonClick('guest',2)

// const uniqueArr = (arr) => [...new Set(arr)];

// console.log(uniqueArr(["前端","js","html","js","css","html"]));

