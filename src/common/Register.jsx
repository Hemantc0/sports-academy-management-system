import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
    const { register, handleSubmit, formState } = useForm()
    let navigateTo = useNavigate()
    
    async function collectFormData(formData) {
        console.log(formData);
        let response=await fetch("http://localhost:8080/api/v1/register", {
            method:"post",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(formData)
        })
        let responseObject=await response.json()
        
        if(response.ok) {
           toast.success(responseObject.message) 
           navigateTo("/login", { replace: true })
        } else {
           toast.error(responseObject.message)
        }
    }    
    
  return (
   <div className='d-flex justify-content-center mt-5'>
      <form className='w-25 border border-2 p-4 rounded-5 bg-white shadow' onSubmit={handleSubmit(collectFormData)}>
            <h1 className='text-center'>Register</h1>
            <hr />
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" 
                {...register("username",{
                 required:{value:true,message: "Username is required" },
                 minLength:{value:3,message:"min 3 characters required"},
                 maxLength:{value:10,message:"max 10 char allowed"}})}
                />
                <div className="text-danger">{formState.errors?.username?.message}</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password"
                {...register("password",
                    {
                        required:{value:true, message:"password is required"},
                        pattern: {value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, message: "Include letters, numbers & special characters"}
                    }
                )}
                />
                <div className="text-danger">{formState.errors?.password?.message}</div>
            </div>
            <div className="mb-3 mt-4">
                <select className="form-select"
                {...register("role", {required:{value:true, message:"Role is required"}})}>
                    <option value="">Select Role</option>
                    <option value="PLAYER">Player</option>
                    <option value="COACH">Coach</option>
                </select>
                <div className="text-danger">{formState.errors?.role?.message}</div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  )
}