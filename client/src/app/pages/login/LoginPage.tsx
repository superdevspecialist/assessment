import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import * as yup from 'yup'
import { Formik } from 'formik'
import { NotificationManager } from 'react-notifications'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { setAuthenticatedUser } from '../../redux/slices/auth.slice'
// import { Card } from 'react-bootstrap'
import { useLoginMutation } from '../../services/auth.service'
import { setShowLoader } from '../../redux/slices/general.slice'
import 'bootstrap/dist/css/bootstrap.min.css'
import './loginPage.css'

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
  // terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
})

const LoginPage = () => {
  const [login, { data, error, isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (data && !error) {
      console.log('LoginPage:: data:', data);
      NotificationManager.success(`Welcome ${data.name}`, 'Authentication Success');
      
      // Assuming the token is part of the response data
      const { access_token, ...userDetails } = data;
      
      // Store token in local storage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userDetails));
      
      // Update Redux store or any other state management
      dispatch(setAuthenticatedUser(userDetails));
      
      // Redirect to home page or any other route
      navigate('/home');
    } else if (error) {
      NotificationManager.error('Error authenticating user, please check your email and password', 'Authentication Error');
      console.log(`LoginPage:: Authentication error`, error);
    }
  }, [data, error, dispatch, navigate]);
  
  useEffect(() => {
    dispatch(setShowLoader(isLoading))
  }, [isLoading, dispatch])

  const handleLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue
    login({ email, password })
  }

  return (
    <div className="login-wrapper bg-bg-main h-screen bg-cover">
      <Formik
        validationSchema={schema}
        onSubmit={handleLogin}
        initialValues={{
          email: '',
          password: '',
          terms: false,
        }}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
          <div className="w-[300px] h-auto max-h-[50vh] inline-block">
            <h1 className="text-white my-12 text-[64px] font-semibold text-center">
              Sign in
            </h1>
            <Form className="form flex flex-col items-center" noValidate onSubmit={handleSubmit}>
              <Form.Group as={Col} md="12" controlId="validationFormikEmail">
                {/* <Form.Label>Email</Form.Label> */}
                <InputGroup hasValidation>
                  {/* <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text> */}
                  <Form.Control
                    className='!bg-[#224957] !text-white outline-none !border-none placeholder-white'
                    type="text"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationFormik02">
                {/* <Form.Label>Password</Form.Label> */}
                <InputGroup hasValidation>
                  {/* <InputGroup.Text id="inputGroupPrepend">&#128273;</InputGroup.Text> */}
                  <Form.Control
                    className='!bg-[#224957] !text-white outline-none !border-none placeholder-white'
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isValid={touched.password && !errors.password}
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  // required
                  name="remember"
                  className='text-white'
                  label="Remember me"
                  // onChange={handleChange}
                  // isInvalid={!!errors.terms}
                  // feedback={errors.terms}
                  feedbackType="invalid"
                  id="validationFormik0"
                />
              </Form.Group>
              <Button type="submit" className='bg-green-500 border-none w-full'>Login</Button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
