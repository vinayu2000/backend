import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
  employeeName: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  pincode:{
    type: Number,
    required: true
  },
  mobileNumber:{
    type: Number,
    required: true
  },
  basicSalary:{
    type: Number,
    required: true
  },
  da:{
    type: Number,
    required: true
  },
  role:{
    type:String,
    default:()=>'employee'
  }
})

const Employee = model('employee', EmployeeSchema);
export { Employee, EmployeeSchema }