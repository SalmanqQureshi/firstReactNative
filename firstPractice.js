// console.log('sadljkasdkjl')

let obj={a:1,b:2,c:3,e:4}
console.log("dsds",Object.entries(obj).map((item,index,array)=>{
    if(item[1]>=3){
        array.push({[`item${index+1}`]:item[1]*10})
        // console.log({[`item${index+1}`]:item[1]})
        console.log(array)
    }

}))
// console.log(obj)
// const fruits = [1,-1,2,-2,3,0,4];
// let res=fruits.filter(num=> num>=0).map(num=> num*num).slice(1)
// console.log(res)
// console.log('before async method');
// const a= loop1MillionTime().then(()=>console.log('return Promise'))
// console.log(a);
// console.log('after async method');

// async function loop1MillionTime(params) {
//     console.log('started looping')
//  for(let i=0; i<1000_000; i++){

//  }
//  console.log('finished looping')
// }
// function simpe(){
//     console.log(...arguments)
// }
// simpe(12,3.3,'4',false)