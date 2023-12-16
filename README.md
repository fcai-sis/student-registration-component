# Student Registration Component

This is the component responsible for registering students in the system. It is an API that receives a list of students and registers them in the database.

The list of students can be in any of the following formats:

- Excel file, supposedly coming from Tansik (مكتب تنسيق القبول بالجامعات والمعاهد)
- JSON (as a POST request body)

In case of an Excel file, a mapping should be provided to map the columns in the file to the fields in the database. The mapping should be in the following JSON format:

```json
{
  "FIELD_NAME_IN_DATABASE": "COLUMN_NAME_IN_FILE"
}
```

Here is an example of a mapping:

```json
{
  "name": "الاسم",
  "nationalId": "الرقم القومي",
  "birthDate": "تاريخ الميلاد"
}
```

## Requirements

- Node.js 20.6.0 or higher
- MongoDB 7.0.0 or higher

## Installation

1. Clone the repository

```
git clone https://github.com/fcai-sis/student-registration-component.git
```

2. Install the dependencies with `npm install`
3. Create a `.env` file in the root of the project and fill it with the required environment variables. The following is an example:

```
PORT=3000
FILE_UPLOAD_PATH=/tmp
LOGS_PATH=./logs
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student-registration
```

The server will log a warning if any of the environment variables are missing.

## Usage

1. Run the application with `npm start`

## Development

1. Run the application in development mode with `npm run serve`

## License

This project is licensed under the [MIT](LICENSE) License.
