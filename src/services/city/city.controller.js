import { City } from "../../database/schema/city.schema.js"

const pincodeRegex = /^[0-9]{6}$/

const createCityHandler = async (req, res) => {
  try {
    const { city, pincode } = req.body
    const role = req.user.role;
    if(role !== 'admin'){
      return res.status(401).send({ STATUS: 'failed', data: 'Not Authorized' })
    }
    if (!city || !pincode ) {
      return res.status(400).send({ STATUS: 'failed', data: 'Incomplete Data' })
    }
    if (!pincodeRegex.test(pincode)) {
      return res.status(400).send({ STATUS: 'failed', data: 'Invalid pincode' })
    }
    const cityData = await City.findOne({ city, pincode })
    if (cityData) {
      return res.status(400).send({ STATUS: 'failed', data: 'City and pincode already exists' })
    }
    const newData = await City.create({city, pincode})
    if (!newData) {
      return res.status(400).send({ STATUS: 'failed', data: 'failed to create city and pincode' })
    }
    res.status(200).send({ STATUS: 'OK', data: newData })

  } catch (error) {
    return res.status(500).send({ STATUS: 'failed', data: `Error while creating city ${error}` })
  }
}

const getCityByPincode = async (req, res) => {
  try {
    const pincode = req.params.id;
    const role = req.user.role;
    if(role !== 'admin'){
      return res.status(401).send({ STATUS: 'failed', data: 'Not Authorized' })
    }
    if (!pincode) {
      return res.status(400).send({ STATUS: 'failed', data: `Pincode required` })
    }
    if (!pincodeRegex.test(pincode)) {
      return res.status(400).send({ STATUS: 'failed', data: 'Invalid pincode' })
    }
    const cityData = await City.findOne({ pincode });
    if (!cityData) {
      return res.status(404).send({ STATUS: 'failed', data: `City does not exists` })
    }
    res.status(200).send({ STATUS: 'OK', data: cityData.city })
  } catch (error) {
    return res.status(500).send({ STATUS: 'failed', data: `Error while getting city ${error}` })
  }
}
export const CityController = {
  createCityHandler,
  getCityByPincode
}