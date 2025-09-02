import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div>
            <p className='font-semibold text-xl text-center mb-5'>Login Now</p>
            <form>
                <div className="hero bg-base-200">
                    <div className="hero-content flex-col lg:flex-row-reverse md:w-[25vw]">
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <div className="card-body md:h-[50vh]">
                                <fieldset className="fieldset">
                                    {
                                        // error1 && <p className='text-red-600'>Please enter correct Email & Password !</p>
                                    }
                                    <label className="label text-black">Email</label>
                                    <input name="email" type="email" className="input" placeholder="Email" required />
                                    <label className="label text-black">Password</label>
                                    <input name="password" type="password" className="input" placeholder="Password" required />
                                    <label className="label text-black">Role</label>
                                    <label className="select">
                                        <select>
                                            <option>Doctor</option>
                                            <option>Patient</option>
                                        </select>
                                    </label>
                                    <p>Don't have an account ? please
                                        <Link className='text-red-600' to="/register"> register</Link></p>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Login</button>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;