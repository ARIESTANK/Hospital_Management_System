using Oracle.ManagedDataAccess.Client;
using System.Data;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("HospitalDb");
    }

    public void TestConnection()
    {
        using (OracleConnection connection = new OracleConnection(_connectionString))
        {
            try
            {
                connection.Open();
                Console.WriteLine("Successfully connected to Hospital Management Database!");
                
                // Optional: Check connection context
                using var command = new OracleCommand("SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') FROM DUAL", connection);
                var serviceName = command.ExecuteScalar();
                Console.WriteLine($"Connected to service: {serviceName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Connection failed: {ex.Message}");
            }
        }
    }

}