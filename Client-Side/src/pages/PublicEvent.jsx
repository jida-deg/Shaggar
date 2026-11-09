import { useContext, useState } from "react";
import { EventContext } from "../context/EventContext";
import "../assets/PublicEvents.css";

const PublicEvent = () => {

  const { events, loading, error } = useContext(EventContext);

  const [showImages, setShowImages] = useState(null);


  if (loading) return <h2>Loading events...</h2>;

  if (error) return <h2>{error}</h2>;



  return (
    <div className="public-events">

      <div className="event-title">
           <h1> Wel-Come To Our Events And News</h1>
      </div>


      <div className="events-container">


      {events.map((event)=>(

        <div className="event-card" key={event._id}>


          <div className="event-content">


            <h2>
              {event.title}
            </h2>



            <p>
              {
                showImages === event._id
                ? event.description
                : event.description.slice(0,120) + "..."
              }
            </p>




            {
            showImages === event._id && (

              <>


                {/* Images after Read More */}

                <div className="event-images">

                {
                  event.images?.map((image,index)=>(

                    <img
                      key={index}
                      src={image.url}
                      alt={event.title}
                    />

                  ))
                }

                </div>

                {/* Date after images */}

                <p className="event-date">

                  📅 {new Date(event.eventDate)
                  .toLocaleDateString()}

                </p>

              </>

            )
            }



            <button
              onClick={() =>
                setShowImages(
                  showImages === event._id
                  ? null
                  : event._id
                )
              }
            >

            {
              showImages === event._id
              ? "Hide"
              : "Read More"
            }

            </button>


          </div>


        </div>


      ))}


      </div>


    </div>
  );
};


export default PublicEvent;