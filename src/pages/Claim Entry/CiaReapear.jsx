import React from 'react';

const CiaReapear = ({ form, setForm }) => {
    const handleChange = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            no_of_papers: e.target.value,
        }));
    };

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium">No of Papers</label>
            <input
                type="number"
                name="no_of_papers"
                value={form.no_of_papers || ''}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter number of papers"
                min="0"
            />
        </div>
    );
};

export default CiaReapear;
