 export const get_time_diff = (last_seen:string,state:string) => {
  
    const lastSeen = new Date(last_seen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime(); 
    const diffMins = Math.floor(diffMs / 60000); 

    if (diffMins < 1) return state;
    if (diffMins < 60) return `${state} ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${state} ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${state} ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  