using Core.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly NotesContext _context;
        public NotesController(NotesContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Gets the names of all the schools.
        /// </summary>
        /// <returns>Returns the list of schools.</returns>
        // GET /api/notes/schools
        [HttpGet("schools")]
        public async Task<IActionResult> GetSchools()
        {
            var schools = await _context.Notes
                .Select(n => n.School)
                .Distinct()
                .ToListAsync();

            return Ok(schools);
        }
        /// <summary>
        /// Given a schools name, this will return all the subjects that are associated with that 
        /// given "school."
        /// </summary>
        /// <param name="school">The name of the school (e.g., "UM", "GT", "NA").</param>
        /// <returns>A list of sublets associated with that school.</returns>
        // GET /api/notes/{school}/subjects
        [HttpGet("{school}/subjects")]
        public async Task<IActionResult> GetSubjects(string school)
        {
            var subjects = await _context.Notes
                .Where(n => n.School == school)
                .Select(n => n.Subject)
                .Distinct()
                .ToListAsync();
            
            return Ok(subjects);
        }

        /// <summary>
        /// Given the school and the subject, this will return all the 
        /// titles associated with that subject.
        /// </summary>
        /// <param name="school">The name of the school (e.g., "UM", "GT", "NA").</param>
        /// <param name="subject">The name of the subject (e.g., "EECS 281: Data Structures and Algorithms"</param>
        /// <returns></returns>
        // GET /api/notes/{school}/{subject}/titles
        [HttpGet("{school}/{subject}/titles")]
        public async Task<IActionResult> GetTitles(string school, string subject)
        {
            var titles = await _context.Notes
                .Where(n => n.School == school && n.Subject == subject)
                .Select(n => n.Title)
                .Distinct()
                .ToListAsync();

            return Ok(titles);
        }

        // GET /api/notes/{school}/{subject}/{title}
        [HttpGet("{school}/{subject}/{title}")]
        public async Task<IActionResult> GetContent(string school, string subject, string title)
        {
            var content = await _context.Notes
                .Where(n => n.School == school 
                    && n.Subject == subject 
                    && n.Title == title)
                .Select(n => n.Content)
                .FirstOrDefaultAsync();
            
            if (content == null)
            {
                return NotFound("Note is not found");
            }
            return Ok(content);
        }

        // PUT /api/notes/{school}/{subject}/{title}
        [HttpPut("{school}/{subject}/{title}")]
        public async Task<IActionResult> UpdateContent(string school, string subject, string title, [FromBody] Note content)
        {
            // find note.
            var foundNote = await _context.Notes
                .FirstOrDefaultAsync(n => n.School == school && n.Subject == subject && n.Title == title);
            
            if (foundNote == null)
            {
                return NotFound("This note is not found.");
            }
            
            // update the note.
            foundNote.Content = content.Content;
            // save change. 
            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        // POST /api/notes/{school}/{subject}/{title}
        [Authorize]
        [HttpPost("{school}/{subject}/{title}")]
        public async Task<IActionResult> CreateContent(string school, string subject, string title, [FromBody] Note note)
        {
            if (note == null)
            {
                return BadRequest("Note data is invalid.");
            }

            try
            {
                note.School = school;
                note.Subject = subject;
                note.Title = subject;

                _context.Notes.Add(note);
                await _context.SaveChangesAsync();

                return Ok(note);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
