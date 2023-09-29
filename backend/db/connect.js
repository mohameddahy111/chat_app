import mongoose from "mongoose"

const connect  = ()=>{
  mongoose.connect(process.env.MONGODB).then(()=>{
    console.log('connnect')
  }).catch((err)=>{
    console.log(err)
  })
}
export default connect