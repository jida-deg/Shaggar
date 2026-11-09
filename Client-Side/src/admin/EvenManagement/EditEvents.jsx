import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EventContext } from "../../context/EventContext";
import "../../assets/EditEvents.css";

const EditEvents = () => {

  const { id } = useParams();

  const { events, updateEvent } = useContext(EventContext);

  const event = events.find(
    (item) => item._id === id
  );


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState([]);



  useEffect(() => {

    if(event){

      setTitle(event.title || "");

      setDescription(event.description || "");


      const normalizedDate = event.eventDate
      ? new Date(event.eventDate)
      .toISOString()
      .slice(0,10)
      : "";


      setEventDate(normalizedDate);

    }

  },[event]);



  if(!event){

    return <h2 className="loading-text">
      Loading event...
    </h2>;

  }



  const save = async()=>{

    try{

      const payload = new FormData();


      payload.append("title",title);

      payload.append("description",description);

      payload.append("eventDate",eventDate);



      if(files.length > 0){

        files.forEach((file)=>{

          payload.append("files",file);

        });

      }


      await updateEvent(id,payload);


      alert("Event updated successfully");


    }catch(error){

      console.log(
        "EDIT ERROR:",
        error.response?.data
      );

    }

  };




  return (

    <div className="edit-event-container">


      <div className="edit-event-card">


        <h2 className="edit-event-title">
          Edit Event
        </h2>




        <div className="edit-event-form">



          <div className="input-group">

            <label>
              Event Title
            </label>


            <input
              className="event-input"
              value={title}
              onChange={(e)=>
                setTitle(e.target.value)
              }
            />

          </div>





          <div className="input-group">

            <label>
              Description
            </label>


            <textarea
              className="event-textarea"
              value={description}
              onChange={(e)=>
                setDescription(e.target.value)
              }
            />

          </div>






          <div className="input-group">

            <label>
              Event Date
            </label>


            <input
              className="event-input"
              type="date"
              value={eventDate}
              onChange={(e)=>
                setEventDate(e.target.value)
              }
            />

          </div>






          <div className="image-upload">

            <label>
              Add New Images (Optional)
            </label>


            <input
              className="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e)=>
                setFiles(
                  Array.from(e.target.files || [])
                )
              }
            />

          </div>






          <button
            className="save-btn"
            onClick={save}
          >

            Save Changes

          </button>
          



        </div>
    


      </div>


    </div>

  );

};


export default EditEvents;