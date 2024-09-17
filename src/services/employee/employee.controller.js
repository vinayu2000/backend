import { City } from "../../database/schema/city.schema.js";
import { Employee } from "../../database/schema/employee.schema.js";

const nameRegex = /^[a-zA-Z\s]+$/;
const mobileRegex = /^[6-9]{1}[0-9]{9}$/;

const createEmployeeHandler = async (req, res) => {
  try {
    const { employeeName, address, city, pincode, mobileNumber, basicSalary } = req.body;
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(401).send({ STATUS: 'failed', data: 'Not Authorized' })
    }
    if (!employeeName || !address || !city || !pincode || !mobileNumber || !basicSalary) {
      return res.status(400).send({ STATUS: 'failed', data: 'Incomplete Data' });
    }
    const existingData = await Employee.findOne({ employeeName });
    if (existingData) {
      return res.status(400).send({ STATUS: 'failed', data: 'Employee already exists' });
    }
    const cityData = await City.findOne({ city, pincode });
    if (!cityData) {
      return res.status(400).send({ STATUS: 'failed', data: 'City and pincode do not exist' });
    }
    if (!nameRegex.test(employeeName)) {
      return res.status(400).send({ STATUS: 'failed', data: 'Invalid employee name, special characters are not allowed' });
    }
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(400).send({ STATUS: 'failed', data: 'Invalid mobile number, must be a 10-digit number' });
    }
    const da = basicSalary * 0.60;
    const employeeData = {
      employeeName,
      address,
      city,
      pincode,
      mobileNumber,
      basicSalary,
      da
    };
    const newEmployee = await Employee.create(employeeData);
    if (!newEmployee) {
      return res.status(400).send({ STATUS: 'failed', data: 'Failed to create employee' });
    }
    res.status(200).send({ STATUS: 'OK', data: newEmployee });
  } catch (error) {
    return res.status(500).send({ STATUS: 'failed', data: `Error while creating employee: ${error}` });
  }
};

const getEmployeeDetailsHandler = async (req, res) => {
  try {
    const employeeID = req.params.id;
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(401).send({ STATUS: 'failed', data: 'Not Authorized' })
    }
    if (!employeeID) {
      return res.status(400).send({ STATUS: 'failed', data: 'employeeID is required' })
    }
    const employeeData = await Employee.findById({ _id: employeeID });
    if (!employeeData._id) {
      return res.status(404).send({ STATUS: 'failed', data: 'Employee details not found' });
    }
    res.status(200).send({ STATUS: 'OK', data: employeeData });
  } catch (error) {
    return res.status(500).send({ STATUS: 'failed', data: `Error while getting employee details: ${error}` });
  }
}

export const EmployeeController = {
  createEmployeeHandler,
  getEmployeeDetailsHandler
}