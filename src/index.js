import express from 'express';
import cors from 'cors';
import { databaseConnection } from './database/mongodb.connection.js';
import { AuthRouterService } from './services/auth/auth.router.js';
import { CityRouterService } from './services/city/city.router.js';
import { EmployeeRouterService } from './services/employee/employee.router.js';
import { AuthController } from './services/auth/auth.controller.js';

const app = express();
const port = 4000;

app.use(express.json())
app.use(cors())

await databaseConnection()

app.use('/auth',AuthRouterService)
app.use('/city',CityRouterService)
app.use('/employee',EmployeeRouterService)

app.use('/**/*',(req,res)=>{
    return res.status(404).send({STATUS:'failed',data:'resource not found'})
})

app.listen(port,()=>{
    console.log(`Server running in the port ${port}`);
})