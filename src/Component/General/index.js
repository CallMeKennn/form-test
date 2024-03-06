import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./General.scss";

const General = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm();
    const { fields, append, remove } = useFieldArray({ control, name: "options" });
    const [previewData, setPreviewData] = useState([]);
    var discountType = null;

    const onSubmit = (data) => {
        if (data.options.length < 1) {
            toast.error("At least 1 option", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const handleAddOption = () => {
        const lastIndex = fields.length - 1;
        const newQuantity = lastIndex >= 0 ? fields[lastIndex].quantity + 1 : 1;
        append({ quantity: newQuantity, title: "", amount: "", discountType: "None" });

        discountType = watch(`options.${fields.length}.discountType`);
        setValue(`options.${fields.length}.discountType`, "none");
        console.log(discountType);
    };

    const handlePreviewChange = (index, field, value) => {
        const updatedPreviewData = [...previewData];
        updatedPreviewData[index] = { ...updatedPreviewData[index], [field]: value };
        setPreviewData(updatedPreviewData);
    };

    const handleDeleteOption = (index) => {
        const updatedPreviewData = [...previewData];
        updatedPreviewData.splice(index, 1);
        setPreviewData(updatedPreviewData);
        remove(index);
    };

    return (
        <div className="container">
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-general">
                        <h2>General</h2>
                        <div>
                            <div className="title-name">Campaigin</div>
                            <input
                                {...register("campaign", { required: true })}
                                type="text"
                                placeholder="Volume discount #2"
                            />
                            {errors.campaign && <div>Campaign Name không được trống</div>}
                        </div>
                        <div>
                            <div className="title-name">Title</div>
                            <input
                                {...register("title", { required: true })}
                                type="text"
                                placeholder="Buy more and save"
                            />
                            {errors.title && <div>Title Name không được trống</div>}
                        </div>
                        <div>
                            <div className="title-name">Description</div>
                            <input
                                {...register("description", { required: true })}
                                type="text"
                                placeholder="Apply for all products in store"
                            />
                            {errors.description && <div>Description Name không được trống</div>}
                        </div>
                    </div>

                    <div className="form-volume">
                        <h2>Volume discount rule</h2>

                        {fields.map((option, index) => (
                            <div>
                                <div className="option-number">
                                    <h3>Option {index + 1}</h3>
                                    <button type="button" onClick={() => handleDeleteOption(index)}>
                                        Delete
                                    </button>
                                </div>
                                <div className="input-fields">
                                    <div className="input-field">
                                        <div>Title</div>
                                        <input
                                            {...register(`options.${index}.title`, { required: true })}
                                            defaultValue={option.title}
                                            placeholder="Single"
                                            onChange={(event) =>
                                                handlePreviewChange(index, "title", event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="input-field">
                                        <div>Subtitle</div>
                                        <input
                                            {...register(`options.${index}.subtitle`, { required: true })}
                                            type="text"
                                            placeholder="Standard price"
                                        />
                                    </div>
                                    <div className="input-field">
                                        <div>Label (optional)</div>
                                        <input
                                            {...register(`options.${index}.label`, { required: true })}
                                            type="text"
                                            placeholder="Description"
                                        />
                                    </div>
                                    <div className="input-field">
                                        <div>Quantity</div>
                                        <input
                                            {...register(`options.${index}.quantity`, {
                                                required: true,
                                                pattern: /^[0-9]+$/,
                                            })}
                                            defaultValue={option.quantity}
                                            onChange={(event) =>
                                                handlePreviewChange(index, "quantity", event.target.value)
                                            }
                                        />
                                        {errors.quantity && <div>Quantity phải nhập số</div>}
                                    </div>
                                    <div className="input-field">
                                        <label>Discount Type</label>
                                        <select setValue {...register(`options.${index}.discountType`)}>
                                            <option value="none">None</option>
                                            <option value="%discount">% discount</option>
                                            <option value="discount">Discount / Each</option>
                                        </select>
                                    </div>
                                    {(discountType = watch(`options.${index}.discountType`))}
                                    {(discountType === "%discount" || discountType === "discount") && (
                                        <div className="input-field">
                                            <div>Amount</div>
                                            <input
                                                {...register(`options.${index}.amount`, {
                                                    required: true,
                                                    pattern: /^[0-9]+$/,
                                                })}
                                                defaultValue={option.amount}
                                                placeholder="amount"
                                                onChange={(event) =>
                                                    handlePreviewChange(index, "amount", event.target.value)
                                                }
                                            />
                                            {discountType === "%discount" ? "%" : "$"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button className="btn" onClick={handleAddOption}>
                            Add option
                        </button>
                        <button className="btn" type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="preview-container">
                <h2>Preview</h2>
                <h2>Buy more and save</h2>
                <div>Apply for all products in store</div>
                <div className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Discount Type</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    {previewData.map((preview, index) => (
                        <tr key={index}>
                            <td>{preview.title}</td>
                            <td>{(discountType = watch(`options.${index}.discountType`))}</td>
                            <td>{preview.quantity}</td>
                            <td>{preview.amount}</td>
                            <hr />
                        </tr>
                    ))}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default General;
