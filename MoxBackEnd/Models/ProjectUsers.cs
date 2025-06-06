using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

[Table("ProjectMembers")]
public class ProjectUser
{
    public int ProjectID { get; set; }
    public Projects Project { get; set; }

    public string UserID { get; set; }
    public Users User { get; set; }
}