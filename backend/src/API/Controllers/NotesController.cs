using Amazon;
using Amazon.S3;
using API.Mapping;
using AutoMapper;
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
        private readonly IMapper _map;
        // Inject our dependencies here! .NET just wants us to register our services and then
        // the instantiation of our object .NET will inject our dependencies using their DI container.
        public NotesController(IUnitOfWork uow, IFileUploader fileUploader, IMapper map)
        {
            _uow = uow;
            _fileUploader = fileUploader;
            _map = map;
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
            return Ok(_map.Map<List<SchoolDTO>>(schools));
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
                return NotFound(HTTPMessagesReturnedToUser.SchoolNotFoundErrorMessage(schoolCode));
            }

            List<Subject> subjects = await _uow.NotesRepo.GetListOfSubjectsOrNullAsync(schoolCode, ct);
            return Ok(_map.Map<List<SubjectDTO>>(subjects));
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
        public async Task<IActionResult> GetNoteTitles(string schoolCode, string subjectCode, CancellationToken ct)
        {
            var result = await _uow.NotesRepo.DoesSchoolExistAsync(schoolCode, ct);
            if (!result)
            {
                return NotFound(HTTPMessagesReturnedToUser.SchoolNotFoundErrorMessage(schoolCode));
            }
            // TODO: Should I be putting error checking? All the info piped into the backend is going to be from the
            //       from the frontend. This error checking seems to intense.
            var titles = await _uow.NotesRepo.GetAllNoteTitlesAsync(schoolCode, subjectCode, ct);
            
            return Ok(titles);
        }

        // GET /api/notes/{school}/{subject}/{title}
        [HttpGet("{schoolCode}/{subjectCode}/{titleCode}")]
        public async Task<IActionResult> GetNote(string schoolCode, string subjectCode, string titleCode, CancellationToken ct)
        {
            if (schoolCode == null || subjectCode == null || titleCode == null)
            {
                return BadRequest(HTTPMessagesReturnedToUser.SchoolOrSubjectOrNoteNotPopulated(schoolCode, subjectCode, titleCode));
            }
            var result = await _uow.NotesRepo.GetNoteAsync(schoolCode, subjectCode, titleCode, ct);
            return Ok(_map.Map<NoteDTO>(result));
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> ImageUpload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file to upload");
            }

            var url = await _fileUploader.UploadAsync(file);

            if (String.IsNullOrEmpty(url.ToString()))
            {
                return BadRequest("Failed to upload image.");
            }

            return Ok(new { url });
        }

        // POST /api/notes/{school}/{subject}/{title}
        // [Authorize] TODO: Do we really Authorization here?
        [HttpPost("{schoolCode}/{subjectCode}/{title}")]
        public async Task<IActionResult> CreateNote(string schoolCode, string subjectCode, string title, CancellationToken ct, [FromBody] NoteCreateDTO note)
        {
            if (note == null)
            {
                return BadRequest("Note data is invalid.");
            }

            Note newNote = new Note
            {
                Title = note.Title,
                CreatedAt = note.CreatedAt,
                Markdown = note.Markdown,
                SubjectId = note.SubjectId
            };

            try
            {
                // Add the new note to EF and this will return an entity with the Id populated.
                var createdNote = await _uow.NotesRepo.AddNoteAsync(newNote, ct);
                await _uow.CommitAsync(ct);
                var resultDTO = _map.Map<NoteDTO>(createdNote);
                // return CreatedAtAction(
                //     nameof(GetNote),
                //     new { schoolCode, subjectCode, title },
                //     resultDTO
                // );
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

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
