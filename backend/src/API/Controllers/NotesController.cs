using Amazon;
using Amazon.S3;
using Core.Helpers;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sprache;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IFileUploader _fileUploader;
        // Inject our dependencies here! .NET just wants us to register our services and then
        // the instantiation of our object .NET will inject our dependencies using their DI container.
        public NotesController(IUnitOfWork uow, IFileUploader fileUploader)
        {
            _uow = uow;
            _fileUploader = fileUploader;
        }
        /// <summary>
        /// Gets the names of all the schools.
        /// </summary>
        /// <returns>Returns the list of schools.</returns>
        // GET /api/notes/schools
        [HttpGet("schools")]
        public async Task<IActionResult> GetSchools(CancellationToken ct)
        {
            // Need await here so schools is an actual List<School>.
            var schools = await _uow.NotesRepo.GetListOfSchoolsOrNullAsync(ct);
            return Ok(schools);
        }
        /// <summary>
        /// Given a schools name, this will return all the subjects that are associated with that 
        /// given "school."
        /// </summary>
        /// <param name="school">The name of the school (e.g., "UM", "GT", "NA").</param>
        /// <returns>A list of sublets associated with that school.</returns>
        // GET /api/notes/{school}/subjects
        [HttpGet("{schoolCode}/subjects")]
        public async Task<IActionResult> GetSubjects(string schoolCode, CancellationToken ct)
        {
            if (schoolCode == null)
            {
                return BadRequest(HTTPMessagesReturnedToUser.SchoolNotSpecifiedErrorMessage());
            }

            var exists = await _uow.NotesRepo.DoesSchoolExistForSubjectAsync(schoolCode, ct);
            if (!exists)
            {
                return BadRequest(HTTPMessagesReturnedToUser.SchoolNotFoundErrorMessage(schoolCode));
            }

            var subjects = await _uow.NotesRepo.GetListOfSubjectsOrNullAsync(schoolCode, ct);
            return Ok(subjects);
        }

        /// <summary>
        /// Given the school and the subject, this will return all the 
        /// titles or "lectures" associated with that subject.
        /// </summary>
        /// <param name="school">The name of the school (e.g., "UM", "GT", "NA").</param>
        /// <param name="subject">The name of the subject (e.g., "EECS 281: Data Structures and Algorithms"</param>
        /// <returns></returns>
        // GET /api/notes/{school}/{subject}/titles
        [HttpGet("{schoolCode}/{subjectCode}/titles")]
        public async Task<IActionResult> GetTitles(string schoolCode, string subjectCode, CancellationToken ct)
        {
            var result = await _uow.NotesRepo.DoesSchoolExistAsync(schoolCode, ct);
            if (!result)
            {
                return BadRequest(HTTPMessagesReturnedToUser.SchoolNotFoundErrorMessage(schoolCode));
            }
            // TODO: Should I be putting error checking? All the info piped into the backend is going to be from the
            //       from the frontend. This error checking seems to intense.
            var titles = await _uow.NotesRepo.GetAllNoteTitlesAsync(schoolCode, subjectCode, ct);
            
            return Ok(titles);
        }

        // // GET /api/notes/{school}/{subject}/{title}
        // [HttpGet("{school}/{subject}/{title}")]
        // public async Task<IActionResult> GetContent(string school, string subject, string title)
        // {
        //     var content = await _context.Notes
        //         .Where(n => n.School == school
        //             && n.Subject == subject
        //             && n.Title == title)
        //         .Select(n => n.Content)
        //         .FirstOrDefaultAsync();

        //     if (content == null)
        //     {
        //         return NotFound("Note is not found");
        //     }
        //     return Ok(content);
        // }

        // // TODO: Complete skeleton for the UploadImage. Need to hook up S3.
        // [HttpPost("uploadImage")]
        // public async Task<IActionResult> ImageUpload([FromForm] IFormFile file)
        // {
        //     if (file == null || file.Length == 0)
        //     {
        //         return BadRequest("No file to upload");
        //     }

        //     var url = await _fileUploader.UploadAsync(file);

        //     if (String.IsNullOrEmpty(url.ToString()))
        //     {
        //         return BadRequest("Failed to upload image.");
        //     }

        //     return Ok(new { url });
        // }

        // POST /api/notes/{school}/{subject}/{title}
        // // [Authorize] TODO: Do we really Authorization here?
        // [HttpPost("{school}/{subject}/{title}")]
        // public async Task<IActionResult> CreateContent(string school, string subject, string title, [FromBody] Note note)
        // {
        //     if (note == null)
        //     {
        //         return BadRequest("Note data is invalid.");
        //     }

        //     try
        //     {
        //         note.School = school;
        //         note.Subject = subject;
        //         note.Title = title;

        //         _context.Notes.Add(note);
        //         await _context.SaveChangesAsync();

        //         return Ok(note);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Internal server error: {ex.Message}");
        //     }
        // }

        // // PUT /api/notes/{school}/{subject}/{title}
        // [HttpPut("{school}/{subject}/{title}")]
        // public async Task<IActionResult> UpdateContent(string school, string subject, string title, [FromBody] Note content)
        // {
        //     // find note.
        //     var foundNote = await _context.Notes
        //         .FirstOrDefaultAsync(n => n.School == school && n.Subject == subject && n.Title == title);

        //     if (foundNote == null)
        //     {
        //         return NotFound("This note is not found.");
        //     }

        //     // update the note.
        //     foundNote.Content = content.Content;
        //     // save change. 
        //     await _context.SaveChangesAsync();
        //     return NoContent();
        // }
        // // DELETE /api/notes/{school}/{subject}/{title}
        // [HttpDelete("{school}/{subject}/{title}")]
        // public async Task<IActionResult> DeleteNote(string school, string subject, string title)
        // {
        //     try
        //     {
        //         // First, see if the note exists.
        //         var foundNote = await _context.Notes.FirstOrDefaultAsync(
        //             n => n.School == school && n.Subject == subject && n.Title == title
        //         );

        //         if (foundNote == null)
        //         {
        //             return NotFound("Note not found.");
        //         }

        //         _context.Notes.Remove(foundNote);
        //         await _context.SaveChangesAsync();
        //         return NoContent();
        //     }
        //     catch (DbUpdateException ex)
        //     {
        //         return StatusCode(500, $"DB EXCEPTION: {ex.Message}");
        //     }
        // }
    }
}
