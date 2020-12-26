class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits) {

    if (subject !== 'All'){
      courses = courses.filter((obj) => obj["subject"].toLowerCase() === subject.toLowerCase());
    }
    if (minimumCredits){
        courses = courses.filter((obj) => obj["credits"] >= minimumCredits);
    }
    if (maximumCredits){
      courses = courses.filter((obj) => obj["credits"] <= maximumCredits);
    }
    
    if (search){
        //console.log(search)
        let courses_filtered = [];
        let search_list = [];
        search_list.push(search.toLowerCase());
        //console.log(search_list);

        if (search_list.length !== 0){

          for (const course of Object.values(courses)) {
            var find = false;
            for (const key of course.keywords){
              if (search_list.every(key_element => key.includes(key_element))){
                  find = true;
                  break;
              }
            }
            if (find === true){
              courses_filtered.push(course);
            }
          }

          courses = courses_filtered;
        }
    }

    return courses;
    
  
    } 
  }


export default SearchAndFilter;
