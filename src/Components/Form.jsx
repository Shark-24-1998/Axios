import { useEffect, useState, useTransition } from "react";
import { postData, updateData } from "../api/PostApi";

const Form = ({ data, setData, updateDataApi, setUpdateDataApi }) => {
  const [addData, setAddData] = useState({
    title: "",
    body: "",
  });

 
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Reset form and modes when updateDataApi changes
  useEffect(() => {
    if (updateDataApi && Object.keys(updateDataApi).length > 0) {
      setAddData({
        title: updateDataApi.title || "",
        body: updateDataApi.body || ""
      });
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [updateDataApi]);
  
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAddData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add Post
  const addPostData = async () => {
    try {
      const res = await postData(addData);
      
      if (res.status === 201) {
        setData([...data, res.data]);
        resetForm();
      }
    } catch (error) {
      console.log("Error adding post:", error);
    }
  };
  
  // Update post
  const updatePostData = async () => {
    try {
      const res = await updateData(updateDataApi.id, addData);
      
      if (res.status === 200) {
        setData((prev) => 
          prev.map((curElem) => 
            curElem.id === res.data.id ? res.data : curElem
          )
        );
        resetForm();
      }
    } catch (error) {
      console.log("Error updating post:", error);
    }
  };
  
  // Reset form and edit mode
  const resetForm = () => {
    setAddData({ title: "", body: "" });
    setIsEditMode(false);
    setUpdateDataApi({});
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      updatePostData();
    } else {
      addPostData();
    }
  };


  
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#1e293b] p-6 rounded shadow-md mb-8">
          <div>
            <input
              className="px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              autoCapitalize="off"
              id="title"
              name="title"
              placeholder="Add Title"
              value={addData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              className="px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              autoCapitalize="off"
              id="body"
              name="body"
              placeholder="Add Description"
              value={addData.body}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button 
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            >
              {isEditMode ? "Edit" : "Add"}
            </button>
            
            {isEditMode && (
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md ml-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default Form;