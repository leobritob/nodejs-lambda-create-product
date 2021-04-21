const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')

const DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' })

exports.handler = async (event) => {
  const body = JSON.parse(event.body)

  const errors = []
  if (!body.name) errors.push('Please enter a name')
  if (!body.price) errors.push('Please enter a price')

  if (errors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors }),
    }
  }

  const product = await createProduct(body)

  return {
    statusCode: 201,
    body: JSON.stringify({ product }),
  }
}

async function createProduct({ name, price }) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        _id: { S: uuid() },
        name: { S: name },
        price: { N: price },
      },
    }

    DynamoDB.putItem(params, (err, data) => {
      if (err) return reject(err)

      return resolve(data)
    })
  })
}
